import type {Express} from 'express';

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';

function docs(app: Express) {
    const rawOpenapiSpecificationPath = path.resolve(process.cwd(), './openapi.yaml');
    const rawOpenapiSpecification = fs.readFileSync(rawOpenapiSpecificationPath, 'utf8');
    const openapiSpecification = yaml.parse(rawOpenapiSpecification);

    // ==================== DOCS ====================
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification, {
        customSiteTitle: 'Engines API',
    }));
}

export {docs};
