/**
 * Copyright 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

const RulesEditorDispatcher = require('./RulesEditorDispatcher.js');

import SettingsActionTypes from './SettingsActionTypes.js';

class SettingsActions {
  static editAudienceNetworkPlacementId(audienceNetworkPlacementId: string) {
    RulesEditorDispatcher.dispatch({
      type: SettingsActionTypes.EDIT_AUDIENCE_NETWORK_PLACEMENT_ID,
      audienceNetworkPlacementId,
    });
  }

  static editFbPixelId(fbPixelId: string) {
    RulesEditorDispatcher.dispatch({
      type: SettingsActionTypes.EDIT_FB_PIXEL_ID,
      fbPixelId,
    });
  }

  static editStyleName(styleName: string) {
    RulesEditorDispatcher.dispatch({
      type: SettingsActionTypes.EDIT_STYLE_NAME,
      styleName,
    });
  }
}

module.exports = SettingsActions;
