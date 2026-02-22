import openai from 'openai'
import {openAIAPIKey} from './backendCredentials.js'

const openAIClient = new openai({apiKey: openAIAPIKey});
export default openAIClient;