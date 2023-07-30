//
//  ExtensionState.swift
//  Twine by SwiftGG
//
//  Created by 朱浩宇 on 2023/7/30.
//

import Foundation

enum ExtensionState {
    case on
    case off
    case unknown

    var text: String {
        switch self {
        case .on:
            "SwiftGG Translator’s extension is currently on. You can turn it off in the Extensions section of Safari Settings."
        case .off:
            "SwiftGG Translator’s extension is currently off. You can turn it on in the Extensions section of Safari Settings."
        case .unknown:
            "You can turn on SwiftGG Translator’s extension in the Extensions section of Safari Settings."
        }
    }
}
