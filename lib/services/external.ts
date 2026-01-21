export async function testExternalAPI(action: string) {
  switch (action) {
    case 'jsonplaceholder':
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
        const data = await response.json();
        return {
          success: true,
          message: 'Fetched data from JSONPlaceholder',
          metadata: {
            title: data.title,
            userId: data.userId,
            id: data.id,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `JSONPlaceholder fetch failed: ${error.message}`,
        };
      }

    case 'github':
      try {
        const response = await fetch('https://api.github.com/repos/vercel/next.js');
        const data = await response.json();
        return {
          success: true,
          message: 'Fetched data from GitHub API',
          metadata: {
            name: data.name,
            fullName: data.full_name,
            stars: data.stargazers_count,
            forks: data.forks_count,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `GitHub API fetch failed: ${error.message}`,
        };
      }

    case 'weather':
      try {
        const apiKey = process.env.WEATHER_API_KEY || 'demo';
        const city = 'London';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
        );
        
        if (!response.ok && apiKey === 'demo') {
          return {
            success: false,
            message: 'Weather API requires API key (demo mode)',
            metadata: { error: 'Set WEATHER_API_KEY environment variable' },
          };
        }

        const data = await response.json();
        return {
          success: true,
          message: `Weather data for ${city}`,
          metadata: {
            city: data.name,
            temperature: data.main?.temp,
            description: data.weather?.[0]?.description,
          },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Weather API fetch failed: ${error.message}`,
        };
      }

    default:
      return {
        success: false,
        message: `Unknown action: ${action}`,
      };
  }
}
