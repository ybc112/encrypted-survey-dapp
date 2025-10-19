const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EncryptedSurvey", function () {
  let encryptedSurvey;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const EncryptedSurvey = await ethers.getContractFactory("EncryptedSurvey");
    encryptedSurvey = await EncryptedSurvey.deploy();
    await encryptedSurvey.waitForDeployment();
  });

  describe("Survey Creation", function () {
    it("Should create a new survey", async function () {
      const tx = await encryptedSurvey.createSurvey(
        "Customer Satisfaction Survey",
        "Please rate our services",
        7 * 24 * 60 * 60 // 7 days
      );

      await expect(tx)
        .to.emit(encryptedSurvey, "SurveyCreated")
        .withArgs(0, owner.address, "Customer Satisfaction Survey");

      const surveyInfo = await encryptedSurvey.getSurveyInfo(0);
      expect(surveyInfo.title).to.equal("Customer Satisfaction Survey");
      expect(surveyInfo.creator).to.equal(owner.address);
      expect(surveyInfo.isActive).to.be.true;
    });

    it("Should add questions to survey", async function () {
      await encryptedSurvey.createSurvey("Test Survey", "Description", 86400);

      await encryptedSurvey.addQuestion(
        0,
        "Are you satisfied with our service?",
        0, // Yes/No
        0
      );

      await encryptedSurvey.addQuestion(
        0,
        "Rate our service (1-5)",
        1, // Rating 1-5
        0
      );

      const question1 = await encryptedSurvey.getQuestion(0, 0);
      expect(question1.questionText).to.equal("Are you satisfied with our service?");
      expect(question1.questionType).to.equal(0);

      const question2 = await encryptedSurvey.getQuestion(0, 1);
      expect(question2.questionText).to.equal("Rate our service (1-5)");
      expect(question2.questionType).to.equal(1);
    });
  });

  describe("Survey Management", function () {
    it("Should allow only creator to add questions", async function () {
      await encryptedSurvey.createSurvey("Test Survey", "Description", 86400);

      await expect(
        encryptedSurvey.connect(user1).addQuestion(0, "Question?", 0, 0)
      ).to.be.revertedWith("Only creator can add questions");
    });

    it("Should allow creator to end survey", async function () {
      await encryptedSurvey.createSurvey("Test Survey", "Description", 86400);

      const tx = await encryptedSurvey.endSurvey(0);
      await expect(tx).to.emit(encryptedSurvey, "SurveyEnded").withArgs(0);

      const surveyInfo = await encryptedSurvey.getSurveyInfo(0);
      expect(surveyInfo.isActive).to.be.false;
    });
  });

  describe("Survey Info", function () {
    it("Should return correct survey count", async function () {
      expect(await encryptedSurvey.surveyCount()).to.equal(0);

      await encryptedSurvey.createSurvey("Survey 1", "Desc 1", 86400);
      expect(await encryptedSurvey.surveyCount()).to.equal(1);

      await encryptedSurvey.createSurvey("Survey 2", "Desc 2", 86400);
      expect(await encryptedSurvey.surveyCount()).to.equal(2);
    });

    it("Should check if survey is expired", async function () {
      await encryptedSurvey.createSurvey("Test Survey", "Description", 1);

      expect(await encryptedSurvey.isExpired(0)).to.be.false;

      // Wait for 2 seconds
      await ethers.provider.send("evm_increaseTime", [2]);
      await ethers.provider.send("evm_mine");

      expect(await encryptedSurvey.isExpired(0)).to.be.true;
    });
  });
});
