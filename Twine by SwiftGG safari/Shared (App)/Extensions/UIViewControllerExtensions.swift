//
//  UIViewControllerExtensions.swift
//  Twine by SwiftGG
//
//  Created by 轻舟 on 2023/7/29.
//

import Foundation
import SwiftUI

extension ViewController {
    
    @discardableResult
    func addSwiftUIView<Content>(_ swiftUIView: Content, to view: UniversalView) -> HostingController<Content> where Content : View {
        let hostingController = HostingController(rootView: swiftUIView)
        addChild(hostingController)
        view.addSubview(hostingController.view)
        
        /// Setup the contraints to update the SwiftUI view boundaries.
        hostingController.view.translatesAutoresizingMaskIntoConstraints = false
        let constraints = [
            hostingController.view.topAnchor.constraint(equalTo: view.topAnchor),
            hostingController.view.leftAnchor.constraint(equalTo: view.leftAnchor),
            view.bottomAnchor.constraint(equalTo: hostingController.view.bottomAnchor),
            view.rightAnchor.constraint(equalTo: hostingController.view.rightAnchor)
        ]
        
        NSLayoutConstraint.activate(constraints)
        
        /// Notify the hosting controller that it has been moved to the current view controller.
#if os(iOS)
        hostingController.didMove(toParent: self)
#endif
        return hostingController
    }
}
