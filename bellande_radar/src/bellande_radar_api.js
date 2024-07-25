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

export class bellande_radar_api {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async streamVideo(url, videoBlob, connectivityPasscode, apiKey) {
        const formData = new FormData();
        formData.append('video', videoBlob, 'video.webm');
        formData.append('connectivityPasscode', connectivityPasscode);

        const response = await fetch(this.baseURL + url, {
            method: 'POST',
            body: formData,
            headers: {
                'Bellande-Framework-Access-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return new BellandeResponse(data.status, data.message);
    }

    async receiveVideoStream(url, connectivityPasscode, apiKey) {
        const requestBody = new RequestBody(connectivityPasscode, 'receive_stream');

        const response = await fetch(this.baseURL + url, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Bellande-Framework-Access-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.body;
    }
}

export class RequestBody {
    constructor(connectivityPasscode, action) {
        this.connectivityPasscode = connectivityPasscode;
        this.action = action;
    }
}

export class BellandeResponse {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    getMessage() {
        return this.message;
    }

    setMessage(message) {
        this.message = message;
    }
}
