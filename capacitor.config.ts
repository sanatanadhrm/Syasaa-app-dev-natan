import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'io.ionic.starter',
    appName: 'Syasaa-App',
    webDir: 'dist',
    server: {
        androidScheme: 'https'
    },
    plugins: {
        LiveUpdates: {
            appId: '41d6a410',
            channel: 'Production',
            autoUpdateMethod: 'background',
            maxVersions: 2
        }
    }
};

export default config;
