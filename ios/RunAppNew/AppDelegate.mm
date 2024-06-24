#import "AppDelegate.h"
#import <Firebase.h>
#import "RNFBMessagingModule.h"
#import <React/RCTBundleURLProvider.h>
#import "RNBootSplash.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  self.moduleName = @"RunAppNew";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [FIRMessaging messaging].APNSToken = deviceToken;
}

- (UIView *)customiseView:(RCTBridge *)bridge
                moduleName:(NSString *)moduleName
                 initProps:(NSDictionary *)initProps {
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:moduleName
                                            initialProperties:initProps];
  rootView.backgroundColor = [UIColor whiteColor]; 
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView]; // Initialize the splash screen
  return rootView;
}
@end
