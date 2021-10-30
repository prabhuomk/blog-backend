import {
    getAllblogData,
    getblogData,
    insertblogData,
    getOneblogData,
    deleteblogData,
    updateblogdata,
    insertUser,
    getUser,
    updateUser,
    inserttoken,
    gettoken,
    deletetoken,
    insertComment,
    getAllComment
  } from "../helper.js";
  import { createConnection } from "../index.js";
  import express from "express";
  import bcrypt from "bcrypt";
  import jwt from "jsonwebtoken";
  
  
  import {sendEmail} from "../middleware/mail.js"
  const router = express.Router();
  
  router.route("/signup").post(async (request, response) => {
    const { email_id,username,password } = request.body;
    const client = await createConnection();
    const user = await getUser(client, { email_id: email_id });
    const name=await getUser(client, { username: username });
    if(user){
        response.send({message:"email_id already exist"});
    }
    else if(name){
        response.send({message:"give a new username"});
    }
    else{

    const hashedPassword = await genPassword(password);
    const pass = await insertUser(client, {
      email_id: email_id,
      username: username,
      password: hashedPassword,
    });
    console.log(hashedPassword, pass);
    response.send({message:"successfully sign up as been done",username:username});
}
  });
  
  router.route("/login").post(async (request, response) => {
    const { email_id, password } = request.body;
    const client = await createConnection();
    const user = await getUser(client, { email_id: email_id });
    if (!user) {
      response.send({ message: "user not exist ,please sign up" });
    } else {
const username=user.username;
  
      const inDbStoredPassword = user.password;
      const isMatch = await bcrypt.compare(password, inDbStoredPassword);
      if (isMatch) {
        const token = jwt.sign({ id: user._id }, process.env.KEY);
  
        response.send({
          message: "successfully login",
          token: token,
          username: username,
        });
      } else {
        response.send({ message: "invalid login" });
      }
    }
  });
  
  router.route("/forgetpassword").post(async (request, response) => {
    const { email_id } = request.body;
    const client = await createConnection();
    const user = await getUser(client, { email_id });
    if (!user) {
      response.send({ message: "user not exist" });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.REKEY);
      const expiryDate = Date.now() + 3600000;
      const store = await inserttoken(client, {
        tokenid: user._id,
        token: token,
        expiryDate: expiryDate,
      });
      const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`;
  
      const mail = await sendEmail(user.email_id, "Password reset", link);
      response.send({
        message: "link has been send to your email for password change",
      });
    }
  });
  
  router.route("/resetpassword/:id/:token").post(async (request, response) => {
    const { password } = request.body;
    const id = request.params.id;
    const token = request.params.token;
    const client = await createConnection();
    const tokens = await gettoken(client, { token: token });
    if (!tokens) {
      response.send({ message: "invalid token" });
    } else {
      if (Date.now() < tokens.expiryDate) {
        const hashedPassword = await genPassword(password);
        const updateuserpassword = await updateUser(client, id, hashedPassword);
        const deletetokens = await deletetoken(client, id);
        response.send({ message: "password updated " });
      } else {
        response.send({ message: "link got expired" });
      }
    }
  });
  
  async function genPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  
  router.route("/listofblogs").get(async (request, response) => {
    const client = await createConnection();
    const mylist = await getAllblogData(client, {});
    response.send(mylist);
  });
  
  router.route("/addblog").post(async (request, response) => {
    const { src,title,description,category,author } = request.body;
    const client = await createConnection();
    const mylist = await getblogData(client, {title:title});
    if(mylist){
        response.send({ message: "same title already exist try new one" });

    }
    else{
      const timeStamp= new Date();
    const date=timeStamp.toLocaleString();
    const myblog = await insertblogData(client, { src,title,description,category,author,date });
    response.send({ message: "Successfully  blog got added" });
    }
  });
  
  router
    .route("/blog/:_id")
    .delete(async (request, response) => {
      const _id = request.params._id;
      console.log(_id);
      const client = await createConnection();
      const deleteblog = await deleteblogData(client, _id);
      response.send({ message: "Successfully  blog got deleted" });
    })
    .get(async (request, response) => {
      const _id = request.params._id;
      const client = await createConnection();
      const getOneblog = await getOneblogData(client, _id);
      response.send(getOneblog);
    })
    .patch(async (request, response) => {
      const _id = request.params._id;
      const {  src,title,description,author } = request.body;
      const timestamp= new Date();
      const date=timestamp.toLocaleString();
      const client = await createConnection();
      const updateblog = await updateblogdata(client, _id, {
        src,title,description,author,date
      });
      response.send({ message: "Successfully  blog got edited" });
    });


    
    router.route("/addcomment").post(async (request, response) => {
        const { comment,username,title } = request.body;
        const time = Date.now()
        const client = await createConnection();
        const myblog = await insertComment(client, {comment,username,title});
        response.send({ message: "Successfully  comment got added" });
        
      });

      router
    .route("/getcomment/:title").get(async (request, response) => {
      const title = request.params.title;
      const client = await createConnection();
      const getallcomment = await getAllComment(client, {title:title});
      response.send(getallcomment);
    })
  
  export const userRouter = router;
  