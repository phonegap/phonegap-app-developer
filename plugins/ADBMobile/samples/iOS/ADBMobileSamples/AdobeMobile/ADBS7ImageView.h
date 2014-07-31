//
//  S7ImageView.h
//  tntPrototype
//
//  Created by Peter Fransen on 12/10/12.
//  Copyright (c) 2012 Adobe Systems, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ADBS7ImageView : UIImageView

@property (nonatomic, copy) NSString *S7ResourceName;
@property (nonatomic, copy) NSString *S7CompanyName;
@property (nonatomic, copy) NSString *S7Params;
@property (nonatomic, copy) NSString *defaultImageName;

-(id) initWithFrame:(CGRect)frame S7Company: (NSString *) co S7Resource: (NSString *) r DefualtImage: (UIImage *) dimg;

@end
