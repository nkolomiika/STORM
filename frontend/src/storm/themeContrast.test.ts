import css from './theme.css?raw';
import { describe, expect, it } from 'vitest';

const root = css.slice(css.indexOf(':root {'), css.indexOf(':root[data-theme="dark"]'));
const dark = css.slice(css.indexOf(':root[data-theme="dark"]'));
const variables = (text: string) => Object.fromEntries([...text.matchAll(/(--st-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
const palette = { ...variables(root), ...variables(dark) };

function luminance(hex: string): number {
  const rgb = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((c) => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
}

function contrast(a: string, b: string): number {
  const [low, high] = [luminance(palette[a]), luminance(palette[b])].sort((x, y) => x - y);
  return (high + .05) / (low + .05);
}

describe('Dark palette: WCAG 2.2 AA contrast', () => {
  const backgrounds = ['--st-bg', '--st-surface', '--st-elevated', '--st-hover', '--st-sunken', '--st-accent-soft'];
  const foregrounds = ['--st-text', '--st-text-2', '--st-text-3', '--st-text-faint', '--st-accent', '--st-accent-2'];
  it.each(foregrounds.flatMap((fg) => backgrounds.map((bg) => [fg, bg])))('%s on %s is at least 4.5:1', (fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
  it.each(['--st-accent', '--st-accent-2'])('primary label on %s is at least 4.5:1', (background) => {
    expect(contrast('--st-on-accent', background)).toBeGreaterThanOrEqual(4.5);
  });
  it.each(['success', 'warn', 'danger', 'purple', 'cyan'])('%s status label is readable', (status) => {
    expect(contrast('--st-'+status, '--st-'+status+'-soft')).toBeGreaterThanOrEqual(4.5);
  });
  it.each(backgrounds.slice(0, 5))('control border and focus on %s are at least 3:1', (background) => {
    expect(contrast('--st-control-border', background)).toBeGreaterThanOrEqual(3);
    expect(contrast('--st-focus-border', background)).toBeGreaterThanOrEqual(3);
  });
});
