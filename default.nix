let pkgs = import <nixpkgs> {};
in with pkgs; let
    
    devDependencies = [
        stdenv
        flow
        watchman
        androidsdk
        gradle25
        openjdk
   ];
    
    dependencies = [
      nodejs 
    ];

in {
    devEnv = stdenv.mkDerivation {
        name = "reactnative-github";
        buildInputs = devDependencies ++ dependencies;
        shellHook = ''
          export PATH="$PATH:./node_modules/.bin"

          export GRADLE_USER_HOME=`pwd`/.gradle
          export ANDROID_HOME=${androidsdk}/libexec/android-sdk-linux
          export PATH="$PATH:$ANDROID_HOME"

          echo "sdk.dir=$ANDROID_HOME" > android/local.properties
        '';
    };
}

