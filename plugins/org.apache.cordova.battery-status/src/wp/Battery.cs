/*  
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
	
	http://www.apache.org/licenses/LICENSE-2.0
	
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

using System;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Ink;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;

using Microsoft.Phone.Info;

namespace WPCordovaClassLib.Cordova.Commands
{
    /// <summary>
    /// Listens for changes to the state of the battery on the device.
    /// </summary>
    public class Battery : BaseCommand
    {
        private bool isPlugged = false;
        private EventHandler powerChanged;
#if WP8
        private Windows.Phone.Devices.Power.Battery battery;
#endif
        public Battery()
        {
            powerChanged = new EventHandler(DeviceStatus_PowerSourceChanged);
            isPlugged = DeviceStatus.PowerSource.ToString().CompareTo("External") == 0;

#if WP8
            battery = Windows.Phone.Devices.Power.Battery.GetDefault();
#endif
        }

        public void start(string options)
        {
            // Register power changed event handler
            DeviceStatus.PowerSourceChanged += powerChanged;

#if WP8
            battery.RemainingChargePercentChanged += Battery_RemainingChargePercentChanged;
#endif

            PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
            result.KeepCallback = true;
            DispatchCommandResult(result);
        }
        public void stop(string options)
        {
            // Unregister power changed event handler
            DeviceStatus.PowerSourceChanged -= powerChanged;
#if WP8
            battery.RemainingChargePercentChanged -= Battery_RemainingChargePercentChanged;
#endif
        }

        private void DeviceStatus_PowerSourceChanged(object sender, EventArgs e)
        {
            isPlugged = DeviceStatus.PowerSource.ToString().CompareTo("External") == 0;
            PluginResult result = new PluginResult(PluginResult.Status.OK, GetCurrentBatteryStateFormatted());
            result.KeepCallback = true;
            DispatchCommandResult(result);
        }

        private void Battery_RemainingChargePercentChanged(object sender, object e)
        {
            PluginResult result = new PluginResult(PluginResult.Status.OK, GetCurrentBatteryStateFormatted());
            result.KeepCallback = true;
            DispatchCommandResult(result);
        }

        private string GetCurrentBatteryStateFormatted()
        {
            int remainingChargePercent = -1;
#if WP8
            remainingChargePercent = battery.RemainingChargePercent;
#endif


            string batteryState = String.Format("\"level\":{0},\"isPlugged\":{1}",
                                                    remainingChargePercent,
                                                    isPlugged ? "true" : "false"
                            );
            batteryState = "{" + batteryState + "}";
            return batteryState;
        }

    }
}
