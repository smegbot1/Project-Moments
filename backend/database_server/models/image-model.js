const aws = require("aws-sdk");
aws.config.update({ region: "eu-west-2" });

const ddb = new aws.DynamoDB.DocumentClient();

const updateDB = (imageLocation, usr) => {
  const params = {
    TableName: "Moments-dev",
    Key: {
      usr
    },
    UpdateExpression: "SET picURL = list_append(picURL, :vals)",
    ExpressionAttributeValues: {
      ":vals": [imageLocation]
    },
    ReturnValues: "UPDATED_NEW"
  };

  return new Promise((resolve, reject) => {
    ddb.update(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({ data });
      }
    });
  });
};

const getAllImages = usr => {
  const params = {
    TableName: "Moments-dev",
    Key: {
      usr
    }
  };

  return new Promise((resolve, reject) => {
    ddb.get(params, (err, data) => {
      if (!data.Item) {
        reject({ statusCode: 404, msg: "user doesn't exist in DB" });
      } else {
        resolve({ data });
      }
    });
  });
};

const deleteFromDB = (usr, url) => {
  return getAllImages(usr)
    .then(
      ({
        data: {
          Item: { picURL }
        }
      }) => {
        const imagesArr = picURL;
        return imagesArr.findIndex(imageURL => imageURL === url);
      }
    )
    .then(indexToDelete => {
      const params = {
        TableName: "Moments-dev",
        Key: {
          usr
        },
        UpdateExpression: `REMOVE picURL[${indexToDelete}]`,
        ReturnValues: "UPDATED_NEW"
      };

      ddb.update(params, (err, data) => {
        if (err) {
          return Promise.reject(err);
        } else {
          return { data };
        }
      });
    });
};
module.exports = { updateDB, getAllImages, deleteFromDB };
