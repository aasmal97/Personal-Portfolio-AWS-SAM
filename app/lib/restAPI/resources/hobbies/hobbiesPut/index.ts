import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuid } from "uuid";
import {
  putTemplate,
  isString,
} from "../../../../../../utils/apiTemplates/putTemplate";
import { convertToStr } from "../../../../../../utils/general/convertToStr";
import { marshall } from "@aws-sdk/util-dynamodb";
const createDocument = (e: APIGatewayEvent) => {
  if (!e.body)
    return {
      statusCode: 400,
      body: "Please provide a valid response body",
    };

  const { name, imgDescription, imgURL, placeholderURL, height, width } = JSON.parse(
    e.body
  );
  if (!name || !imgDescription || !imgURL || !height || !width)
    return {
      statusCode: 400,
      body: "You must provide a name, imgDescription, imgURL, placeholderURL, height, and width attribute",
    };
  if (
    !isString(name) ||
    !isString(imgDescription) ||
    !isString(imgURL) ||
    (placeholderURL && !isString(placeholderURL))
  )
    return {
      statusCode: 400,
      body: "Invalid types assigned to either name, imgDescription, imgURL or placeholderURL",
    };
  const currDate = new Date().toISOString();
  const document = {
    pk: {
      orientation: width / height >= 1 ? "horizontal" : "vertical",
      dateCreated: currDate,
    },
    recordType: "hobbies",
    id: uuid(),
    name: name,
    imgDescription: imgDescription,
    imgURL: imgURL,
    placeholderURL: placeholderURL,
    height: height,
    width: width,
    dateCreated: currDate,
    orientation: width / height >= 1 ? "horizontal" : "vertical",
  };
  return marshall(document, {
    convertClassInstanceToMap: true,
    removeUndefinedValues: true,
  });
};
export async function handler(
  e: APIGatewayEvent
): Promise<APIGatewayProxyResult> {
  return await putTemplate({
    e,
    callback: createDocument,
    tableName: convertToStr(process.env.AMAZON_DYNAMO_DB_HOBBIES_TABLE_NAME),
    successMessage: "Added hobby document to hobbies table",
  });
}
