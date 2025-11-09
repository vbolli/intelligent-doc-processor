import { Firestore } from '@google-cloud/firestore';

// Initialize Firestore.
// Assumes application-default credentials are set up.
// https://cloud.google.com/docs/authentication/provide-credentials-adc
const firestore = new Firestore();

export const executionsCollection = firestore.collection('executions');
export const schemasCollection = firestore.collection('schemas');

export default firestore;