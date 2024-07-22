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

import { bellande_lidar_service } from './bellande_lidar_service.js';
import { bellande_lidar_api } from './bellande_lidar_api.js';
import { LidarDriver } from './lidar_driver.js';  // Assume this is a separate module for LiDAR hardware interaction

export class bellande_lidar_activity {
  constructor() {
    this.lidarService = null;
    this.connectivityPasscode = null;
    this.lidarDriver = null;
    this.isScanning = false;
    this.scanInterval = null;
    this.config = this.loadConfigFromFile();
    this.initializeLidarService();
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

  initializeLidarService() {
    if (!this.config) {
      throw new Error("Failed to load configuration");
    }

    const apiUrl = this.config.url;
    const lidarEndpoint = this.config.endpoint_path.lidar;
    const apiAccessKey = this.config.Bellande_Framework_Access_Key;
    this.connectivityPasscode = this.config.connectivity_passcode;

    const lidarApi = new bellande_lidar_api(apiUrl);
    this.lidarService = new bellande_lidar_service(apiUrl, lidarEndpoint, apiAccessKey, lidarApi);

    this.lidarDriver = new LidarDriver();
  }

  async startLidarScanning() {
    if (this.isScanning) {
      console.log("LiDAR is already scanning");
      return;
    }

    try {
      await this.lidarDriver.initialize();
      this.isScanning = true;
      this.scanInterval = setInterval(async () => {
        const lidarData = await this.lidarDriver.getScan();
        await this.sendLidarData(lidarData);
      }, 1000);
    } catch (error) {
      console.error("Failed to start LiDAR scanning:", error);
      this.isScanning = false;
    }
  }

  async stopLidarScanning() {
    if (!this.isScanning) {
      console.log("LiDAR is not currently scanning");
      return;
    }

    clearInterval(this.scanInterval);
    this.isScanning = false;
    await this.lidarDriver.shutdown();
  }

  async sendLidarData(lidarData) {
    try {
      const response = await this.lidarService.sendLidarData(lidarData, this.connectivityPasscode);
      console.log("LiDAR data sent successfully. Status:", response.getStatus(), "Message:", response.getMessage());
    } catch (error) {
      console.error("Failed to send LiDAR data:", error);
    }
  }

  async getLidarAnalysis() {
    try {
      const analysis = await this.lidarService.getLidarAnalysis(this.connectivityPasscode);
      console.log("Received LiDAR analysis:", analysis);
      return analysis;
    } catch (error) {
      console.error("Failed to get LiDAR analysis:", error);
      throw error;
    }
  }
}
