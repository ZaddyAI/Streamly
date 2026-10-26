// Copies Next.js' static export (out/) into build/, which is the folder you
// upload to your web host. Runs automatically after `npm run build`.
import { cpSync, existsSync, rmSync } from "node:fs"
import { join } from "node:path"

const source = join(process.cwd(), "out")
const target = join(process.cwd(), "build")

if (!existsSync(source)) {
    console.error("\nNo `out/` directory found — run `next build` before this script.\n")
    process.exit(1)
}

rmSync(target, { recursive: true, force: true })
cpSync(source, target, { recursive: true })

console.log("\nStatic export copied to build/")
console.log("Upload the *contents* of build/ into your web root (e.g. public_html).\n")
