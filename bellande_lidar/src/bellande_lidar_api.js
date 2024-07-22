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

export class bellande_lidar_api {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async sendLidarData(url, lidarData, connectivityPasscode, apiKey) {
    const response = await fetch(this.baseURL + url, {
      method: 'POST',
      body: lidarData,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Bellande-Framework-Access-Key': apiKey,
        'Connectivity-Passcode': connectivityPasscode
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return new BellandeResponse(data.status, data.message);
  }

  async getLidarAnalysis(url, connectivityPasscode, apiKey) {
    const response = await fetch(this.baseURL + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Bellande-Framework-Access-Key': apiKey,
        'Connectivity-Passcode': connectivityPasscode
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
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
