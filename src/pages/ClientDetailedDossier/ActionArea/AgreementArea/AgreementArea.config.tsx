export enum ProgressBarSteps {
  CreateAgreementStep = 0,
  DownloadAgreementStep = 1,
  SignAgreementStep = 2,
  CheckRequisites = 3,
  ErrorStep = -1,
}

export enum DocsStatus {
  Received = 'received',
  Downloaded = 'downloaded',
  Signed = 'signed',
}
