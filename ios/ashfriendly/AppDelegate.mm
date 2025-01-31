#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <GoogleMaps/GoogleMaps.h>
#import <Firebase.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"ashfriendly";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
   if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  self.initialProps = @{};
  [GMSServices provideAPIKey:@"AIzaSyBiEgWxsKROcXUKT-JmU7uWHO5jvsVAhmc"];
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG 
  // return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
  return [NSURL URLWithString:@"http://192.168.20.15:8081/index.bundle?platform=ios"];

#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
