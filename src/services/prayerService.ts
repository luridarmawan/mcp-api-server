
import { http } from "../utils/http";

// services/prayerService.ts
export const getPrayerSchedule = async (city: string) => {
  try {
    const response = await http.get(`${process.env.PRAYER_SCHEDULE}?format=text&city=${city}`)
    return {
      success: true,
      data: response.data
    }
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch prayer schedule'
    }
  }
};

