//
//  Foo.h
//  Holds peripherial, service and characteristic
//  TODO rename
//

#import <Foundation/Foundation.h>
#import <CoreBluetooth/CoreBluetooth.h>

@interface Foo : NSObject

@property CBPeripheral *peripheral;
@property CBService *service;
@property CBCharacteristic *characteristic;

@end

