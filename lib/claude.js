import Anthropic from '@anthropic-ai/sdk'
import { getPersonaById } from './travelerPersonas'

const BASE_SYSTEM_PROMPT = `You are NomadVital's health and nutrition advisor for international travelers.
You provide research-backed wellness information about eating safely, managing dietary conditions,
and staying healthy while traveling. Be specific, practical, and friendly.

Always end every response involving a medical condition, medication, allergy, or dietary
restriction with this exact sentence on a new line:
"Please note: this is general wellness information for educational purposes only — not medical
advice. Always consult your doctor before making changes to your diet or medication while traveling."`

export async function callClaude(userMessage, personaId = 'general') {
  const persona = getPersonaById(personaId)

  const systemPrompt = `${BASE_SYSTEM_PROMPT}

TRAVELER CONTEXT: ${persona.systemPromptAddition}

Always tailor your answer specifically to this type of traveler's needs and concerns.`

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const block = message.content[0]
  if (!block || block.type !== 'text') {
    throw new Error('Unexpected response from Claude')
  }
  return block.text
}
