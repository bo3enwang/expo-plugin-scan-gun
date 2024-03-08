"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const withIosAppDelegateImport = (config) => {
    // @ts-ignore
    const newConfig = (0, config_plugins_1.withAppDelegate)(config, (config) => {
        const newSrc = ["#import <RNKeyEvent.h>"];
        const newConfig = (0, generateCode_1.mergeContents)({
            tag: "react-native-keyevent-import",
            src: config.modResults.contents,
            newSrc: newSrc.join("\n"),
            anchor: `#import "AppDelegate.h"`,
            offset: 1,
            comment: "//",
        });
        return {
            ...config,
            modResults: newConfig,
        };
    });
    return newConfig;
};
const withIosAppDelegateBody = (config) => {
    // @ts-ignore
    const newConfig = (0, config_plugins_1.withAppDelegate)(config, (config) => {
        const newSrc = [
            "RNKeyEvent *keyEvent = nil;",
            " ",
            "- (NSMutableArray<UIKeyCommand *> *)keyCommands {",
            "  NSMutableArray *keys = [NSMutableArray new];",
            "   ",
            "  if (keyEvent == nil) {",
            "    keyEvent = [[RNKeyEvent alloc] init];",
            "  }",
            "   ",
            "  if ([keyEvent isListening]) {",
            '    NSArray *namesArray = [[keyEvent getKeys] componentsSeparatedByString:@","];',
            "     ",
            '    NSCharacterSet *validChars = [NSCharacterSet characterSetWithCharactersInString:@"ABCDEFGHIJKLMNOPQRSTUVWXYZ"];',
            "     ",
            "    for (NSString* names in namesArray) {",
            "      NSRange  range = [names rangeOfCharacterFromSet:validChars];",
            "       ",
            "      if (NSNotFound != range.location) {",
            "        [keys addObject: [UIKeyCommand keyCommandWithInput:names modifierFlags:UIKeyModifierShift action:@selector(keyInput:)]];",
            "      } else {",
            "        [keys addObject: [UIKeyCommand keyCommandWithInput:names modifierFlags:0 action:@selector(keyInput:)]];",
            "      }",
            "    }",
            "  }",
            "   ",
            "  return keys;",
            "}",
            "",
            "- (void)keyInput:(UIKeyCommand *)sender {",
            "  NSString *selected = sender.input;",
            "  [keyEvent sendKeyEvent:selected];",
            "}",
        ];
        const newConfig = (0, generateCode_1.mergeContents)({
            tag: "react-native-keyevent-body",
            src: config.modResults.contents,
            newSrc: newSrc.join("\n"),
            anchor: `@implementation AppDelegate`, // /#import "AppDelegate\.h"/g,
            offset: 1,
            comment: "//",
        });
        return {
            ...config,
            modResults: newConfig,
        };
    });
    return newConfig;
};
const withAndroidMainActivityImport = (config) => {
    // @ts-ignore
    const newConfig = (0, config_plugins_1.withMainActivity)(config, (config) => {
        const newSrc = [
            "import android.view.KeyEvent;",
            "import com.github.kevinejohn.keyevent.KeyEventModule;",
        ];
        const newConfig = (0, generateCode_1.mergeContents)({
            tag: "react-native-keyevent-import",
            src: config.modResults.contents,
            newSrc: newSrc.join("\n"),
            anchor: `;`,
            offset: 1,
            comment: "//",
        });
        return {
            ...config,
            modResults: newConfig,
        };
    });
    return newConfig;
};
const withAndroidMainActivityBody = (config) => {
    // @ts-ignore
    const newConfig = (0, config_plugins_1.withMainActivity)(config, (config) => {
        const newSrc = [
            "private boolean mCaps;",
            "private StringBuilder sb = new StringBuilder();",
            "",
            "",
            "public static final boolean isConfirmKey(int keyCode) {",
            "    switch (keyCode) {",
            "        case KeyEvent.KEYCODE_DPAD_CENTER:",
            "        case KeyEvent.KEYCODE_ENTER:",
            "        case KeyEvent.KEYCODE_SPACE:",
            "        case KeyEvent.KEYCODE_NUMPAD_ENTER:",
            "            return true;",
            "        default:",
            "            return false;",
            "    }",
            "}",
            "",
            "public boolean isInputFromScanner(Context context, KeyEvent event) {",
            "  if (event.getDevice() == null) {",
            "    return false;",
            "  }",
            "  if (event.getKeyCode() == KeyEvent.KEYCODE_BACK || event.getKeyCode() == KeyEvent.KEYCODE_VOLUME_DOWN || event.getKeyCode() == KeyEvent.KEYCODE_VOLUME_UP) {",
            "    return false;",
            "  }",
            "  if (event.getDevice().getSources() == (InputDevice.SOURCE_KEYBOARD | InputDevice.SOURCE_DPAD | InputDevice.SOURCE_CLASS_BUTTON)) {",
            "    return false;",
            "  }",
            "  Configuration cfg = context.getResources().getConfiguration();",
            "  return cfg.keyboard != Configuration.KEYBOARD_UNDEFINED;",
            "}",
            "",
            "private void checkLetterStatus(KeyEvent event) {",
            "  int keyCode = event.getKeyCode();",
            "  if (keyCode == KeyEvent.KEYCODE_SHIFT_RIGHT || keyCode == KeyEvent.KEYCODE_SHIFT_LEFT) {",
            "      if (event.getAction() == KeyEvent.ACTION_DOWN) {",
            "          mCaps = true;",
            "      } else {",
            "          mCaps = false;",
            "      }",
            "  }",
            "}",
            "",
            "",
            "@Override",
            "public boolean dispatchKeyEvent(KeyEvent event) {",
            "  if (!isInputFromScanner(this, event)) {",
            "    return super.dispatchKeyEvent(event);",
            "  }",
            "  int action = event.getAction();",
            "  checkLetterStatus(event);",
            "",
            "  switch (action) {",
            "    case KeyEvent.ACTION_DOWN:",
            "        if (event.getKeyCode() == KeyEvent.KEYCODE_SHIFT_RIGHT || event.getKeyCode() == KeyEvent.KEYCODE_SHIFT_LEFT) {",
            "        } else {",
            "            if (event.getKeyCode() == KeyEvent.KEYCODE_ENTER) {",
            "            } else {",
            "                char x = getInputCode(event);",
            "                sb.append(x);",
            "            }",
            "        }",
            "        if (event.getKeyCode() == KeyEvent.KEYCODE_VOLUME_UP) {",
            "            return super.dispatchKeyEvent(event);",
            "        }",
            "        if (event.getKeyCode() == KeyEvent.KEYCODE_VOLUME_DOWN) {",
            "            return super.dispatchKeyEvent(event);",
            "        }",
            "        if (event.getKeyCode() == KeyEvent.KEYCODE_BACK) {",
            "            return super.dispatchKeyEvent(event);",
            "        }",
            "        if (event.getKeyCode() == KeyEvent.KEYCODE_MENU) {",
            "            return super.dispatchKeyEvent(event);",
            "        }",
            "        if (event.getKeyCode() == KeyEvent.KEYCODE_HOME) {",
            "            return super.dispatchKeyEvent(event);",
            "        }",
            "        if (event.getKeyCode() == KeyEvent.KEYCODE_POWER) {",
            "            return super.dispatchKeyEvent(event);",
            "        }",
            "        final int len = sb.length();",
            "        if (isConfirmKey(event.getKeyCode())) {",
            "          KeyEventModule.getInstance().onKeyDownEvent(sb.toString(), event);",
            "          if (sb.length() > 0) {",
            "              sb.setLength(0);",
            "          }",
            "        }",
            "        return true;",
            "    default:",
            "      break;",
            "  }",
            "  return super.dispatchKeyEvent(event);",
            "}",
        ];
        const newConfig = (0, generateCode_1.mergeContents)({
            tag: "react-native-keyevent-body",
            src: config.modResults.contents,
            newSrc: newSrc.join("\n"),
            anchor: `public class MainActivity extends ReactActivity {`,
            offset: 1,
            comment: "//",
        });
        return {
            ...config,
            modResults: newConfig,
        };
    });
    return newConfig;
};
const initPlugin = (config) => {
    config = withIosAppDelegateImport(config);
    config = withIosAppDelegateBody(config);
    config = withAndroidMainActivityImport(config);
    config = withAndroidMainActivityBody(config);
    return config;
};
exports.default = initPlugin;
