//
//  ViewController.swift
//  Shared (App)
//
//  Created by 轻舟 on 2023/7/17.
//

//import WebKit
import SwiftUI

#if os(iOS)
import UIKit
typealias PlatformViewController = UIViewController
typealias HostingController = UIHostingController
typealias UniversalView = UIView
typealias UniversalColor = UIColor
#elseif os(macOS)
import Cocoa
import SafariServices
typealias PlatformViewController = NSViewController
typealias HostingController = NSHostingController
typealias UniversalView = NSView
typealias UniversalColor = NSColor
#endif

let extensionBundleIdentifier = "com.swiftgg.Twine-by-SwiftGG.Extension"

class ViewController: PlatformViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        let homeView = HomeView()
        self.addSwiftUIView(homeView, to: self.view)
    }
}
