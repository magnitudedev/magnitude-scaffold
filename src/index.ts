import { startBrowserAgent } from "magnitude-core";
import z from 'zod';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    // Start at our example issue tracker clone
    const agent = await startBrowserAgent({
        // Starting URL for agent
        url: 'https://magnitasks.com',
        // Show thoughts and actions
        narrate: true,
        // Any system instructions specific to your agent or website
        prompt: 'Prefer mouse to keyboard when filling out form fields'
    });

    // Magnitude can handle high-level tasks
    await agent.act("Add a new member", {
        // Pass data that the agent will use where appropriate
        data: {
            name: "Magnus",
            email: "magnus@magnitude.run",
            color: "blue",
        }
    });

    // You can pass custom prompt instructions to any act()
    await agent.act('Create a new task assigned to Magnus', { prompt: 'Make up task data' });
   
    await agent.act('Drag the first todo to In Progress');

    // Intelligently extract data based on the DOM content matching a provided zod schema
    const tasks = await agent.extract('Extract all tasks in todo column', z.array(z.object({
        title: z.string(),
        description: z.string(),
        priority: z.enum(['low', 'medium', 'high', 'urgent']),
        labels: z.array(z.string()),
        assignee: z.string()
    })));

    console.log("Todos left:", tasks);

    // Stop agent and browser
    await agent.stop();
}

main();