import { Request, Response, NextFunction } from 'express';

export const preroute = (req: Request, res: Response, next: NextFunction) => {
  // Remove the stage prefix from the path
  const stage = process.env.STAGE || 'dev';
  const stagePrefix = `/${stage}`;
  
  if (req.path.startsWith(stagePrefix)) {
    // Use Express's built-in URL rewriting
    const newPath = req.path.replace(stagePrefix, '') || '/';
    const newUrl = newPath + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '');
    
    // Rewrite the URL
    req.url = newUrl;
  }
  
  next();
};
