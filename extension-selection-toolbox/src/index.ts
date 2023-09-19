import { showHUD, Clipboard, getSelectedText, open } from "@raycast/api";

export default async function main() {
  const selectedText = await getSelectedText();

  const url = `https://www.google.com/search?q=${encodeURIComponent(selectedText)}`;

  open(url);
}
