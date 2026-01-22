import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function testGit(action: string) {
  switch (action) {
    case 'status':
      try {
        const { stdout } = await execAsync('git status --short');
        const changes = stdout.trim().split('\n').filter(Boolean);
        return {
          success: true,
          message: `Git status: ${changes.length} changes`,
          metadata: { changes: changes.length, files: changes },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Git status failed: ${error.message}`,
        };
      }

    case 'log':
      try {
        const { stdout } = await execAsync('git log --oneline -5');
        const commits = stdout.trim().split('\n').filter(Boolean);
        return {
          success: true,
          message: `Retrieved ${commits.length} recent commits`,
          metadata: { commits, count: commits.length },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Git log failed: ${error.message}`,
        };
      }

    case 'branch':
      try {
        const { stdout } = await execAsync('git branch --show-current');
        return {
          success: true,
          message: `Current branch: ${stdout.trim()}`,
          metadata: { branch: stdout.trim() },
        };
      } catch (error: any) {
        return {
          success: false,
          message: `Git branch failed: ${error.message}`,
        };
      }

    default:
      return {
        success: false,
        message: `Unknown action: ${action}`,
      };
  }
}
