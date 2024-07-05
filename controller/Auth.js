const User = require("../models/User");
const otpGenrator = require("otp-genrator");
const OTP = require("../models/OTP");

//signup

exports.signUp = async (req , res) => {
  //data fetch from request ki body

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    accountType,
    contactNumber,
  } = req.body;
  //validate data

  if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
    return res.status(403).json({
        success : false,
        message : "All fields are required"
    })
  }
  //2 password match
  //check user exist or not

  //find most recent otp stored for the user
  //Hash the passwword
  //craete entry in db
  //resturn res
};

//Login

//sendOtp

//logic behind the otp

exports.sendOTP = async (req, res) => {
  //fecth email from request ki body

  try {
    const { email } = req.body;

    //check if user alredy exisist

    const checkUserPresent = await User.findOne(email);

    //if useralredy exist , then return response

    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    //genrate otp

    var otp = otpGenrator.genrate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log(otp);

    //check unique otp or not
    const result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenrator(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    //create an entry for otp

    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);

    //return response successfully

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//changepassword
