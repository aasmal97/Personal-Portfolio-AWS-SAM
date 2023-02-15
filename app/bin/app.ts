#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { RestAPIStack } from "../lib/restAPI/restAPIStack";
import { WebhooksStack } from "../lib/webhooks/webhooksStack";
import { HostingStack } from "../lib/hosting/hostingStack";
const app = new cdk.App();
const hostingStack = new HostingStack(app, "HostingStack");
const restAPIStack = new RestAPIStack(app, "RestApiStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
//map rest api gateway stack
const hostingZone = hostingStack.getHostedZone();
const certificate = hostingStack.getCertificate();
//create apo
restAPIStack.createAPI(hostingStack);
restAPIStack.mapAPIToHostedZone(hostingZone, certificate);

const webhooksStack = new WebhooksStack(app, "WebhooksStack", {});
const webhooksCertificate = webhooksStack.createCertificate(hostingZone);
webhooksStack.mapAPIToHostedZone(hostingZone, webhooksCertificate);
webhooksStack.createAPI();
