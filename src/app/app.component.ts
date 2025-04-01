import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ColorChoice = 'all' | Color;
type Color = 'yellow' | 'white';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [FormsModule],
})
export class AppComponent {
  private readonly COLOR_PATTERN = 'col';
  private readonly CHARACTER_MAP = new Map<string, string>([
    ...'abcdefghijklmnopqrstuvwxyz'
      .split('')
      .map((char): [string, string] => [
        char,
        `:alphabet-${this.COLOR_PATTERN}-${char}:`,
      ]),
    [
      'æ',
      `:alphabet-${this.COLOR_PATTERN}-a::alphabet-${this.COLOR_PATTERN}-e:`,
    ],
    [
      'ø',
      `:alphabet-${this.COLOR_PATTERN}-o::alphabet-${this.COLOR_PATTERN}-e:`,
    ],
    [
      'å',
      `:alphabet-${this.COLOR_PATTERN}-a::alphabet-${this.COLOR_PATTERN}-a:`,
    ],
    ['@', `:alphabet-${this.COLOR_PATTERN}-at:`],
    ['#', `:alphabet-${this.COLOR_PATTERN}-hash:`],
    ['?', `:alphabet-${this.COLOR_PATTERN}-question:`],
    ['!', `:alphabet-${this.COLOR_PATTERN}-exclamation:`],
    [' ', ':transparent-square:'],
  ]);

  protected readonly colorChoice = signal<ColorChoice>('all');
  protected readonly colors = computed(() =>
    this.colorChoice() === 'all' ? ['yellow', 'white'] : [this.colorChoice()],
  );

  protected readonly inputText = signal('');
  protected readonly outputText = computed(() =>
    this.createSlackText(this.inputText()),
  );

  private createSlackText(text: string) {
    const colors = this.colors();

    return text
      .split('')
      .map((char) => ({
        char,
        mappedChar: this.CHARACTER_MAP.get(char.toLowerCase()),
      }))
      .reduce(
        ({ result, colorIndex }, { char, mappedChar }) => ({
          result: `${result}${mappedChar?.replaceAll(this.COLOR_PATTERN, colors[colorIndex]) ?? char}`,
          colorIndex:
            (mappedChar?.includes(this.COLOR_PATTERN) ?? false)
              ? colorIndex === colors.length - 1
                ? 0
                : colorIndex + 1
              : colorIndex,
        }),
        { result: '', colorIndex: 0 },
      ).result;
  }
}
