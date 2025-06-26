import { startBrowserAgent } from "magnitude-core";
import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const agent = await startBrowserAgent({
        // Starting URL for agent
        url: 'https://docs.magnitude.run/getting-started/quickstart',
        // Show thoughts and actions
        narrate: true
    });

    // Intelligently extract data based on the DOM content matching a provided zod schema
    const gettingStarted = await agent.extract('Extract how to get started with Magnitude', z.object({
        // Agent can extract existing data or new insights
        difficulty: z.enum(['easy', 'medium', 'hard']),
        steps: z.array(z.string()),
    }));

    // Navigate to a new URL
    await agent.nav('https://magnitasks.com');

    // Magnitude can handle high-level tasks
    await agent.act('Create a task', { 
        // Optionally pass data that the agent will use where appropriate
        data: { 
            title: 'Get started with Magnitude', 
            description: gettingStarted.steps.map(step => `• ${step}`).join('\n') 
        } 
    });

    // It can also handle low-level actions
    await agent.act('Drag "Get started with Magnitude" to the top of the in progress column');

    // Stop agent and browser
    await agent.stop();
}

main();
