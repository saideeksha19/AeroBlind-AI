import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from '../App';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ATMOSPHERIC_TARGETS, SYNTHETIC_SCENARIOS } from '../data/researchData';

describe('AeroBlind AI Scientific Observatory UI & scientific verification', () => {
  it('renders all sections, exact benchmark metrics, scientific caveats, and external links', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /Seeing the Invisible\./i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Can AI reconstruct atmospheric signals from satellite observations\?/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/ILLUSTRATIVE SYNTHETIC DEMONSTRATION — NOT LIVE MODEL INFERENCE\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Illustrative Synthetic Spread \(Not Calibrated Model Confidence\)/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Standardized Target Predictions Only:/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No Real-Time Monitoring Claim:/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/internal validation results—not Kaggle leaderboard scores/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Exp08 is exploratory and optimistic/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Exp09 uses a separate site-level holdout/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/lower MCRMSE is better/i).length).toBeGreaterThan(0);

    expect(screen.getAllByText(/0\.95581/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0\.95143/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0\.95105/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0\.93078/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0\.92399/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/0\.86305/).length).toBeGreaterThan(0);

    const githubLinks = screen.getAllByRole('link', {
      name: /GitHub Repository|^GitHub$/i,
    });
    expect(githubLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of githubLinks) {
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/saideeksha19/AeroBlind-AI'
      );
      expect(link).toHaveAttribute('target', '_blank');
    }

    const kaggleLinks = screen.getAllByRole('link', {
      name: /Kaggle OBSCURA|^Kaggle$/i,
    });
    expect(kaggleLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of kaggleLinks) {
      expect(link).toHaveAttribute(
        'href',
        'https://www.kaggle.com/competitions/obscura/overview'
      );
      expect(link).toHaveAttribute('target', '_blank');
    }

    const devpostLinks = screen.getAllByRole('link', {
      name: /Devpost Project|^Devpost$/i,
    });
    expect(devpostLinks.length).toBeGreaterThanOrEqual(2);
    for (const link of devpostLinks) {
      expect(link).toHaveAttribute('href', 'https://obscura.devpost.com/');
      expect(link).toHaveAttribute('target', '_blank');
    }
  });

  it('switches across all five atmospheric targets via tabs and target cards', async () => {
    const user = userEvent.setup();
    render(<App />);

    for (const target of ATMOSPHERIC_TARGETS) {
      const tab = screen.getByRole('tab', {
        name: new RegExp(`${target.id} · ${target.name}`, 'i'),
      });
      await user.click(tab);
      expect(tab).toHaveAttribute('aria-selected', 'true');
      expect(
        screen.getByText(
          new RegExp(`ILLUSTRATIVE SYNTHETIC PREDICTION · ${target.id}`, 'i')
        )
      ).toBeInTheDocument();
    }

    const no2InspectBtn = screen.getByRole('button', {
      name: /Inspect NO2 in Demo/i,
    });
    await user.click(no2InspectBtn);
    expect(
      screen.getByRole('tab', { name: /NO2 · Nitrogen-dioxide-related indicator/i })
    ).toHaveAttribute('aria-selected', 'true');
  });

  it('activates all four synthetic presets, adjusts all five sliders at extreme bounds, and resets cleanly', async () => {
    const user = userEvent.setup();
    render(<App />);

    const resetBtn = screen.getByRole('button', {
      name: /Reset Synthetic Profile/i,
    });
    expect(resetBtn).toBeDisabled();

    for (const scenario of SYNTHETIC_SCENARIOS) {
      const presetBtn = screen.getByRole('button', { name: scenario.name });
      await user.click(presetBtn);
      expect(presetBtn).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByText(scenario.regimeDescription)).toBeInTheDocument();
    }

    const sliderLabels = [
      /Synthetic Spectral Band Index/i,
      /Synthetic Thermal Anomaly Proxy/i,
      /Synthetic Aerosol Optical Proxy/i,
      /Synthetic Wind Ventilation/i,
      /Synthetic Cloud Occlusion/i,
    ];

    for (const [idx, label] of sliderLabels.entries()) {
      const slider = screen.getByLabelText(label) as HTMLInputElement;
      fireEvent.change(slider, { target: { value: idx % 2 === 0 ? '100' : '0' } });
      expect(slider.value).toBe(idx % 2 === 0 ? '100' : '0');
    }

    expect(resetBtn).toBeEnabled();
    expect(screen.getByText('Custom Profile')).toBeInTheDocument();

    await user.click(resetBtn);
    expect(resetBtn).toBeDisabled();
    expect(screen.getByText('Preset Active')).toBeInTheDocument();
    const spectralSlider = screen.getByLabelText(
      /Synthetic Spectral Band Index/i
    ) as HTMLInputElement;
    expect(spectralSlider.value).toBe('54');
  });

  it('toggles model performance chart view and filters/inspects experiments 01-10', async () => {
    const user = userEvent.setup();
    render(<App />);

    const allRunsBtn = screen.getByRole('button', { name: /All Recorded Runs/i });
    await user.click(allRunsBtn);
    expect(allRunsBtn).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByText(/All six recorded validation runs across OOF and separate holdout/i)
    ).toBeInTheDocument();

    const experimentsSection = document.getElementById('experiments') as HTMLElement;
    const foundationsFilter = within(experimentsSection).getByRole('button', {
      name: 'Foundations',
    });
    await user.click(foundationsFilter);
    expect(foundationsFilter).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(experimentsSection).getByText('EXPERIMENT 01 · Foundations')
    ).toBeInTheDocument();

    const validationFilter = within(experimentsSection).getByRole('button', {
      name: 'Validation',
    });
    await user.click(validationFilter);
    expect(validationFilter).toHaveAttribute('aria-pressed', 'true');

    const exp09Btn = within(experimentsSection).getByRole('button', {
      name: /EXP 09/i,
    });
    await user.click(exp09Btn);
    expect(
      within(experimentsSection).getByText('EXPERIMENT 09 · Validation')
    ).toBeInTheDocument();
  });

  it('navigates all six pipeline stages via tabs and Previous/Next controls', async () => {
    const user = userEvent.setup();
    render(<App />);

    const pipelineSection = document.getElementById('pipeline') as HTMLElement;
    const nextBtn = within(pipelineSection).getByRole('button', {
      name: /Next Stage/i,
    });
    const prevBtn = within(pipelineSection).getByRole('button', {
      name: /Previous Stage/i,
    });

    expect(prevBtn).toBeDisabled();
    await user.click(nextBtn);
    expect(
      within(pipelineSection).getByText('STAGE 02 SPECIFICATION')
    ).toBeInTheDocument();
    expect(prevBtn).toBeEnabled();

    const stage06Tab = within(pipelineSection).getByRole('tab', {
      name: /Stage 06/i,
    });
    await user.click(stage06Tab);
    expect(
      within(pipelineSection).getByText('STAGE 06 SPECIFICATION')
    ).toBeInTheDocument();
    expect(nextBtn).toBeDisabled();
  });

  it('toggles mobile navigation drawer and closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<App />);

    const openMenuBtn = screen.getByRole('button', {
      name: /Open navigation menu/i,
    });
    await user.click(openMenuBtn);
    expect(
      screen.getByRole('navigation', { name: /Mobile navigation/i })
    ).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(
      screen.queryByRole('navigation', { name: /Mobile navigation/i })
    ).not.toBeInTheDocument();
  });

  it('catches rendering failures in ErrorBoundary and recovers when Retry Section is clicked', async () => {
    const user = userEvent.setup();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let shouldThrow = true;

    function FlakyChild() {
      if (shouldThrow) {
        throw new Error('Simulated chart failure');
      }
      return <p>Recovered visualization</p>;
    }

    render(
      <ErrorBoundary>
        <FlakyChild />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Simulated chart failure/i)).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByRole('button', { name: /Retry Section/i }));
    expect(screen.getByText('Recovered visualization')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
