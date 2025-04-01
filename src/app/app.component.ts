import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass, NgOptimizedImage } from '@angular/common';

type ColorScheme = 'yellow' | 'white' | 'mix1' | 'mix2';
type Color = 'yellow' | 'white';

interface MappedCharacter {
  character: string;
  icons: string[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [FormsModule, NgOptimizedImage, NgClass],
})
export class AppComponent {
  protected readonly COLOR_SCHEMES: Record<ColorScheme, { colors: Color[] }> = {
    yellow: { colors: ['yellow'] },
    white: { colors: ['white'] },
    mix1: {
      colors: ['yellow', 'white'],
    },
    mix2: {
      colors: ['white', 'yellow'],
    },
  };

  private readonly COLOR_PATTERN = 'col';
  private readonly ICON_MAP = new Map<string, string[]>([
    ...'abcdefghijklmnopqrstuvwxyz'
      .split('')
      .map((char): [string, string[]] => [
        char,
        [`alphabet-${this.COLOR_PATTERN}-${char}`],
      ]),
    [
      'æ',
      [`alphabet-${this.COLOR_PATTERN}-a`, `alphabet-${this.COLOR_PATTERN}-e`],
    ],
    [
      'ø',
      [`alphabet-${this.COLOR_PATTERN}-o`, `alphabet-${this.COLOR_PATTERN}-e`],
    ],
    [
      'å',
      [`alphabet-${this.COLOR_PATTERN}-a`, `alphabet-${this.COLOR_PATTERN}-a`],
    ],
    ['@', [`alphabet-${this.COLOR_PATTERN}-at`]],
    ['#', [`alphabet-${this.COLOR_PATTERN}-hash`]],
    ['?', [`alphabet-${this.COLOR_PATTERN}-question`]],
    ['!', [`alphabet-${this.COLOR_PATTERN}-exclamation`]],
  ]);

  protected readonly selectedColorScheme = signal<ColorScheme>('yellow');
  protected readonly inputText = signal('');

  protected readonly outputIcons = computed(() =>
    this.iconList(this.inputText()),
  );

  protected readonly outputText = computed(() =>
    this.iconList(this.inputText())
      .flatMap((mappedCharacter: MappedCharacter) =>
        mappedCharacter.icons.length === 0
          ? mappedCharacter.character === ' '
            ? '    '
            : mappedCharacter.character
          : mappedCharacter.icons.map((icon) => `:${icon}:`),
      )
      .join(''),
  );

  private iconList(text: string): MappedCharacter[] {
    const colors = this.COLOR_SCHEMES[this.selectedColorScheme()].colors;

    return text
      .split('')
      .map((char) => ({
        char,
        icons: this.ICON_MAP.get(char.toLowerCase()),
      }))
      .reduce(
        ({ result, colorIndex }, { char, icons }) => ({
          result: [
            ...result,
            {
              character: char,
              icons:
                icons?.map((icon) =>
                  icon.replaceAll(this.COLOR_PATTERN, colors[colorIndex]),
                ) ?? [],
            },
          ],
          colorIndex:
            (icons?.some((icon) => icon.includes(this.COLOR_PATTERN)) ?? false)
              ? colorIndex === colors.length - 1
                ? 0
                : colorIndex + 1
              : colorIndex,
        }),
        { result: [] as MappedCharacter[], colorIndex: 0 },
      ).result;
  }

  protected copy() {
    void navigator.clipboard.writeText(this.outputText());
  }

  protected setColorScheme(key: ColorScheme) {
    this.selectedColorScheme.set(key);
  }
}
