import { refreshConfig, refreshStatus } from '../services';
import { refreshGateway, refreshLogin } from '../views';

export function refreshAll() {
    refreshConfig();
    refreshStatus();
    refreshGateway();
    refreshLogin();
}
