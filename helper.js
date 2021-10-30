import mongodb from "mongodb";

export async function insertUser(client, user) {
  const result = await client.db("myblog").collection("user").insertOne(user);
  console.log("successfully pass inserted", result);
  return result;
}

export async function getUser(client, filter) {
  const result = await client.db("myblog").collection("user").findOne(filter);
  console.log("successfully matched", result);
  return result;
}

export async function updateUser(client, _id, password) {
  const result = await client
    .db("myblog")
    .collection("user")
    .updateOne(
      { _id: new mongodb.ObjectId(_id) },
      { $set: { password: password } }
    );
  console.log("successfully new password updated", result);
  return result;
}

export async function inserttoken(client, user) {
  const result = await client
    .db("myblog")
    .collection("tokens")
    .insertOne(user);
  console.log("successfully pass inserted", result);
  return result;
}

export async function gettoken(client, filter) {
  const result = await client
    .db("myblog")
    .collection("tokens")
    .findOne(filter);
  console.log("successfully matched", result);
  return result;
}

export async function deletetoken(client, tokenid) {
  const deletetokens = await client
    .db("myblog")
    .collection("tokens")
    .deleteOne({ tokenid: new mongodb.ObjectId(tokenid) });
  console.log("successfully token is deleted", deletetokens);
  return deletetokens;
}

export async function getAllblogData(client, filter) {
  const blog = await client
    .db("myblog")
    .collection("list_blog")
    .find(filter)
    .toArray();
  console.log("successfully all blogs are obtanied", blog);
  return blog;
}

export async function insertblogData(client, filter) {
  const blog = await client
    .db("myblog")
    .collection("list_blog")
    .insertOne(filter);
  console.log("successfully blog are inserted", blog);
  return blog;
}

export async function getOneblogData(client, _id) {
  const result = await client
    .db("myblog")
    .collection("list_blog")
    .findOne({ _id: new mongodb.ObjectId(_id) });
  console.log("successfully blog obtained", result);
  return result;
}
export async function getblogData(client,filter) {
  const result = await client
    .db("myblog")
    .collection("list_blog")
    .findOne(filter);
  console.log("successfully blog obtained", result);
  return result;
}

export async function updateblogdata(client, _id, filter) {
  const result = await client
    .db("myblog")
    .collection("list_blog")
    .updateOne({ _id: new mongodb.ObjectId(_id) }, { $set: filter });
  console.log("successfully updated", result);
  return result;
}

export async function deleteblogData(client, _id) {
  const result = await client
    .db("myblog")
    .collection("list_blog")
    .deleteOne({ _id: new mongodb.ObjectId(_id) });
  console.log("successfully blog is deleted", result);
  return result;
}


export async function getAllComment(client, filter) {
    const blog = await client
      .db("myblog")
      .collection("list_comment")
      .find(filter)
      .toArray();
    console.log("successfully all comment are obtanied", blog);
    return blog;
  }
  
  export async function insertComment(client, filter) {
    const blog = await client
      .db("myblog")
      .collection("list_comment")
      .insertOne(filter);
    console.log("successfully comment are inserted", blog);
    return blog;
  }
  
