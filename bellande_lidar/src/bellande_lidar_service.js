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

import { BellandeResponse } from './bellande_lidar_api.js';

export class bellande_lidar_service {
  constructor(apiUrl, lidarEndpoint, apiAccessKey, lidarApi) {
    this.lidarApi = lidarApi;
    this.apiAccessKey = apiAccessKey;
    this.lidarEndpoint = lidarEndpoint;
  }

  async sendLidarData(lidarData, connectivityPasscode) {
    try {
      const response = await this.lidarApi.sendLidarData(
        this.lidarEndpoint,
        lidarData,
        connectivityPasscode,
        this.apiAccessKey
      );
      return response;
    } catch (error) {
      console.error("Error in sendLidarData:", error);
      throw error;
    }
  }

  async getLidarAnalysis(connectivityPasscode) {
    try {
      const analysis = await this.lidarApi.getLidarAnalysis(
        this.lidarEndpoint + "/analysis",
        connectivityPasscode,
        this.apiAccessKey
      );
      return analysis;
    } catch (error) {
      console.error("Error in getLidarAnalysis:", error);
      throw error;
    }
  }
}
