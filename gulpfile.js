const gulp = require("gulp");
const { task, src, dest, parallel } = gulp;

task("test", async () => {
    console.log("Gulp is working");
    return true;
});

task("copy-verbatim-directories", async () => {
    return gulp.src([
        "src/icons/*.png"
    ], {
        base: "src"
    }).pipe(gulp.dest("dist"));
});
