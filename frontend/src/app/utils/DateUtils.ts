export class DateUtils {
    static formatDateRange(from: Date, to: Date): string {
        return `${this.format(from)} - ${this.format(to)}`;
    };

    static formatDayMonth(date: Date) {
        return this.format(date);
    };

    static minDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    static formatSelectedDays = (dates: { day: Date, hour: number }[]): string => {
        if (dates.length > 1) {
          let startDay = new Date(dates[0].day);
          let startHour = dates[0].hour;
          let endDay = new Date(dates[dates.length - 1].day);
          let endHour = dates[dates.length - 1].hour + 0.5;
    
          if (startDay.getDate() !== endDay.getDate()) {
            return `${this.format(startDay)}, ${this.formatHour(startHour)} - ${this.format(endDay)}, ${this.formatHour(endHour)}`;
          } else {
            return `${this.format(startDay)}, ${this.formatHour(startHour)} - ${this.formatHour(endHour)}`;
          }
        } else {
          return `${this.format(new Date(dates[0].day))}, ${this.formatHour(dates[0].hour)} - ${this.formatHour(dates[0].hour + 0.5)}`;
        }
      }

    static formatHour = (hour: number): string => {
        const intHour = Math.floor(hour); 
        const minutes = hour % 1 === 0 ? '00' : '30';  
        return `${intHour.toString().padStart(2, '0')}:${minutes}`; 
    };

    static getFollowingDays = (date: Date): Date[] => {
      const weekDates: Date[] = [];
    
      for (let i = 0; i < 7; i++) {
          const weekDate = new Date(date); 
          weekDate.setDate(date.getDate() + i);
          weekDates.push(weekDate);
      }
    
      return weekDates;
    };

    static getDayNames = (): string[] => {
      return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    } 

    static formatDate = (date: Date): string => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
      };
    
      return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
    }

    private static format = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        return `${day}.${month}`;
    };
}