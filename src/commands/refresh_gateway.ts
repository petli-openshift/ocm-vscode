import { refreshConfig, refreshStatus } from '../services';
import { refreshGateway as refreshGatewayView } from '../views';

export function refreshGateway() {
    refreshConfig();
    refreshStatus();
    refreshGatewayView();
}
