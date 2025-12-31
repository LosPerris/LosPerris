import { apis } from "../data/apis";

export const getSystemStatus = () => {
    return {
        status: "ok",
        message: "Los Perris API Gateway",
        timestamp: new Date().toISOString(),
        services: apis.map(api => ({
            name: api.title,
            description: api.description,
            status: "operational",
            endpoints: api.endpoints.map(ep => ({
                method: ep.method,
                path: ep.path
            }))
        }))
    };
};
