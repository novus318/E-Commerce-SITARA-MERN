import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js"
export const signupController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      city,
      zip,
      landmark,
      state,
      address,
      question,
    } = req.body;
    //valudate
    if (!name) {
      return res.send({
        message: "Name is required",
      });
    }
    if (!email) {
      return res.send({
        message: "email is required",
      });
    }
    if (!password) {
      return res.send({
        message: "password is required",
      });
    }
    if (!phone) {
      return res.send({
        message: "phone number is required",
      });
    }
    if (!question) {
      return res.send({
        message: "answer is required",
      });
    }

    //check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered Please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      phone,
      city,
      zip,
      landmark,
      state,
      address,
      password: hashedPassword,
      question,
    }).save();
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).send({
      success: true,
      message: "User Registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        zip: user.zip,
        landmark: user.landmark,
        state: user.state,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Signup",
      error,
    });
  }
};
export const loginController = async (req, res) => {
  try {
    const email = req.body.email2;
    const password = req.body.password2;
    //validate
    if (!email || !password) {
      return res.status(406).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not Registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        zip: user.zip,
        landmark: user.landmark,
        state: user.state,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};
export const googleController = async (req, res) => {
  try {
    const email = req.body.emailg
    const name = req.body.nameg;
    const user = await userModel.findOne({email});
    if (user) {
       //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
      res.status(201).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          zip: user.zip,
          landmark: user.landmark,
          state: user.state,
          address: user.address,
          role: user.role,
        },
        token,
      });
    }
    if (!user) {
      const newUser =new userModel({ email, name }).save();
      const token = await JWT.sign({ _id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(201).send({
        success: true,
        message: "login successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          city: newUser.city,
          zip: newUser.zip,
          landmark: newUser.landmark,
          state: newUser.state,
          address: newUser.address,
          role: newUser.role,
        },
        token,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error",
      error,
    });
  }
};
//forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, question, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!question) {
      res.status(400).send({
        message: "Answer is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "Password is required",
      });
    }
    //check
    const user = await userModel.findOne({ email, question });
    //validate
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      massage: "Something went wrong",
      error,
    });
  }
};
//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, phone, city, zip, landmark, state, address } = req.body;
    const user = await userModel.findById(req.params.pid);
    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.pid,
      {
        name: name || user.name,
        phone: phone || user.phone,
        city: city || user.city,
        zip: zip || user.zip,
        landmark: landmark || user.landmark,
        state: state || user.state,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};
//text controller
export const testController = (req, res) => {
  res.send("protected Route");
};

//orders
export const getOrdersController=async(req,res)=>{
  try {
    const orders =await orderModel.find({buyer:req.params.pid}).populate('products','-photo').populate("buyer","name")
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error while getting orders',
      error
    })
  }
}
//delete orders
export const deleteOrderController =async(req,res)=>{
  try {
      await orderModel.findByIdAndDelete(req.params.pid)
      res.status(200).send({
          success:true,
          message:'Order deleted Successfully'
      })
  } catch (error) {
      console.log(error)
      res.status(500).send({
          success:false,
          message:'Error while deleting order',
          error
      })
  }
}

// all orders
export const getAllOrdersController=async(req,res)=>{
  try {
    const orders =await orderModel.find({}).populate('products','-photo').populate("buyer","name").sort({createdAt:'-1'})
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error while getting orders',
      error
    })
  }
}
//status
export const orderStatusController=async(req,res)=>{
  try {
    const {orderId}= req.params
    const {status}=req.body
    const orders =await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error while Updating order staus',
      error
    })
  }
}