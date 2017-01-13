# generator-ko-ts2

Fork of Steven Sanderson's generator-KO for typescript. 

Forked from aniliht reverting the TS change.

##### Includes

* Knockout MVVM
* Typescript
* Bootstrap 4 alpha
* Sass - for css
* Browsersync - syncing changes in browser

###NodeJs Npm

    install Node.js with Npm
    
    Yeoman
    npm install --global yo
    
    Bower
    npm install -g bower
    
    Gulp          
    npm install -g gulp    
    npm install -g gulp-cli

Typescript:
http://www.typescriptlang.org/#download-links

VS Web Essentials:
http://vswebessentials.com/download    

####Local install of generator:

    In the generator-ko-ts2 folder, run npm link

####Generate new ko-ts2 project

        yo ko-ts2

#### Build typescript

        tsc
        
#### Serve commands
    
    gulp dist
    gulp src

#### Generate components
        

        yo ko-ts2:component componentName


Check gulpfile for more tasks.

