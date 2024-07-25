/**
 * Copyright (C) 2024 Bellande Application UI UX Research Innovation Center, Ronaldson Bellande
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 **/

import { bellande_radar_service } from './bellande_radar_service.js';
import { bellande_radar_api } from './bellande_radar_api.js';

export class bellande_radar_activity {
    constructor() {
        this.radarService = null;
        this.connectivityPasscode = null;
        this.config = this.loadConfigFromFile();
        this.initializeRadarService();
    }

    loadConfigFromFile() {
        try {
            const config = require('../config/configs.json');
            return config;
        } catch (error) {
            console.error("Error reading config file:", error);
            return null;
        }
    }

    initializeRadarService() {
        if (!this.config) {
            throw new Error("Failed to load configuration");
        }

        const apiUrl = this.config.url;
        const streamEndpoint = this.config.endpoint_path.stream;
        const apiAccessKey = this.config.Bellande_Framework_Access_Key;
        this.connectivityPasscode = this.config.connectivity_passcode;

        const radarApi = new bellande_radar_api(apiUrl);
        this.radarService = new bellande_radar_service(apiUrl, streamEndpoint, apiAccessKey, radarApi);
    }

    async startVideoCapture() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                await this.streamVideo(blob);
            };

            mediaRecorder.start();

            setTimeout(() => mediaRecorder.stop(), 10000);
        } catch (error) {
            console.error("Error capturing video:", error);
        }
    }

    async streamVideo(videoBlob) {
        try {
            const response = await this.radarService.streamVideo(videoBlob, this.connectivityPasscode);
            console.log("Video streamed successfully. Status:", response.getStatus(), "Message:", response.getMessage());
        } catch (error) {
            console.error("Failed to stream video:", error);
        }
    }

    async receiveVideoStream() {
        try {
            const stream = await this.radarService.receiveVideoStream(this.connectivityPasscode);
            console.log("Received video stream");
        } catch (error) {
            console.error("Failed to receive video stream:", error);
        }
    }
}
