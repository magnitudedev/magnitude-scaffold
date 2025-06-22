import { startBrowserAgent } from "magnitude-core";
import z from 'zod';

async function main() {
    const agent = await startBrowserAgent({
        url: 'https://news.ycombinator.com/show'
    });

    await agent.act('click on the first post that is a github repo');

    const repoInfo = await agent.extract('summarize information about the repo', z.object({
        link: z.string().describe("GitHub repo link"),
        summary: z.string().describe("Describe what the repo does"),
        stars: z.number(),
        languages: z.array(z.string()).describe("Languages repo is written in"),
        recency: z.string().describe('When was the repo last updated?')
    }));

    console.log("Collected information about repo:", repoInfo);

    // just a jira clone as an example!
    await agent.nav('https://magnitasks.com');

    await agent.act('Create a task to check out this repo', { data: {
        link: repoInfo.link,
        summary: repoInfo.summary
    }});

    await agent.stop();
}

main();