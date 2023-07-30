//
//  HomeView.swift
//  Twine by SwiftGG
//
//  Created by 轻舟 on 2023/7/29.
//

import SwiftUI
import FluidGradient
import SwiftUIX
import SafariServices

struct HomeView: View {
    @State var state = ExtensionState.unknown
    
    var body: some View {
        ZStack {
            Color.white
            
            FluidGradient(blobs: [
                .init(hexadecimal: "B51FFB"),
                .init(hexadecimal: "517CEB"),
                .init(hexadecimal: "3F8CFF"),
                .init(hexadecimal: "CA5AFF"),
                .init(hexadecimal: "5AD7FF"),
            ],
                          highlights: [
                            .init(hexadecimal: "9949FF"),
                            .init(hexadecimal: "8E00FD"),
                            .init(hexadecimal: "6BA6FF"),
                          ],
                          speed: 0.45,
                          blur: 0.75)
            .background(Color(NSColor.quaternaryLabelColor))
            
            VStack {
                Text("Welcome To\nTwine by SwiftGG")
                    .multilineTextAlignment(.center)
                    .font(.system(size: 38, weight: .heavy))
                    .lineSpacing(10)
                    .padding(.top, 5)

                Text(state.text)
                    .multilineTextAlignment(.center)
                    .font(.system(size: 18, weight: .bold))
                    .padding(.top, 40)
                    .lineSpacing(8)
                    .frame(width: 550)
                
                Button {
                    openSafariPreferences()
                } label: {
                    if #available(macOS 12.0, *) {
                        Text("Quit and Open Safari Settings...")
                            .font(.system(size: 14, weight: .medium))
                            .padding(10)
                            .padding(.horizontal, 6)
                            .background(.regularMaterial)
                            .cornerRadius(10)
                    } else {
                        Text("Quit and Open Safari Settings...")
                            .font(.system(size: 14, weight: .medium))
                            .padding(10)
                            .padding(.horizontal, 6)
                            .background(.black.opacity(0.4))
                            .cornerRadius(10)
                    }
                }
                .buttonStyle(PlainButtonStyle())
                .padding(.top, 80)
                
                Spacer()
            }
            .padding(55)
        }
        .ignoresSafeArea()
        .onAppear {
            SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier) { (state, error) in
                guard let state = state, error == nil else {
                    // Insert code to inform the user that something went wrong.
                    return
                }

                if state.isEnabled {
                    self.state = .on
                } else {
                    self.state = .off
                }
            }
        }
    }
    
    func openSafariPreferences() {
#if os(macOS)
        SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) { error in
            guard error == nil else {
                // Insert code to inform the user that something went wrong.
                return
            }
            
            DispatchQueue.main.async {
                NSApplication.shared.terminate(nil)
            }
        }
#endif
    }
}

struct HomeView_Previews: PreviewProvider {
    static var previews: some View {
        HomeView()
            .frame(width: 750, height: 550)
    }
}
