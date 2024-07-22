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

export class bellande_camera_service {
    constructor(apiUrl, streamEndpoint, apiAccessKey, cameraApi) {
        this.cameraApi = cameraApi;
        this.apiAccessKey = apiAccessKey;
        this.streamEndpoint = streamEndpoint;
    }

    async streamVideo(videoBlob, connectivityPasscode) {
        try {
            const response = await this.cameraApi.streamVideo(
                this.streamEndpoint,
                videoBlob,
                connectivityPasscode,
                this.apiAccessKey
            );
            return response;
        } catch (error) {
            console.error("Error in streamVideo:", error);
            throw error;
        }
    }

    async receiveVideoStream(connectivityPasscode) {
        try {
            const stream = await this.cameraApi.receiveVideoStream(
                this.streamEndpoint,
                connectivityPasscode,
                this.apiAccessKey
            );
            return stream;
        } catch (error) {
            console.error("Error in receiveVideoStream:", error);
            throw error;
        }
    }
}
