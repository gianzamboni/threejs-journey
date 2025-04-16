import { describe, it, expect, beforeEach, vi, Mock, Mocked } from 'vitest';

import { Collapsable } from '#/app/components/collapsable';
import { Exercise } from '#/app/types/exercise';
import * as ExerciseMetadata from '#/app/utils/exercise-metadata';

import { InfoBox } from '../info-box';
// Mock dependencies
vi.mock('#/app/components/collapsable');
vi.mock('#/app/utils/exercise-metadata', () => ({
  getId: vi.fn(),
  getDescriptions: vi.fn()
}));

describe('InfoBox', () => {
  let infoBox: InfoBox;
  let parent: HTMLDivElement;
  let mockCollapsable: Mocked<Partial<Collapsable>>;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup mocks
    (Collapsable as unknown as Mock).mockImplementation(() => {
      return mockCollapsable = {
        addTo: vi.fn(),
        updateTitle: vi.fn(),
        replaceContent: vi.fn(),
        close: vi.fn()
      };
    });

    // Create instance
    infoBox = new InfoBox();
    parent = document.createElement('div');
    document.body.appendChild(parent);
    infoBox.addTo(parent);
  });

  it('should create and initialize the info box correctly', () => {
    expect(infoBox.container).toBeDefined();
    expect(Collapsable).toHaveBeenCalledWith('info-box', 'Información', expect.any(Object));
    expect(mockCollapsable.addTo).toHaveBeenCalled();
  });

  it('should add info box to a parent element', () => {
    infoBox.addTo(parent);
    expect(parent.children.length).toBe(1);
    expect(parent.firstChild).toBe(infoBox.container);
    expect(infoBox.container.id).toBe('info-box-container');
  });

  it('should update content with descriptions', () => {
    // Setup mock exercise and metadata
    const mockExercise = {} as Exercise;
    const mockId = 'TestExercise';
    const mockDescriptions = ['<p>Test description</p>'];

    (ExerciseMetadata.getId as Mock).mockReturnValue(mockId);
    (ExerciseMetadata.getDescriptions as Mock).mockReturnValue(mockDescriptions);

    // Update content
    infoBox.updateContent(mockExercise);

    // Verify calls
    expect(ExerciseMetadata.getId).toHaveBeenCalledWith(mockExercise);
    expect(ExerciseMetadata.getDescriptions).toHaveBeenCalledWith(mockExercise);
    expect(mockCollapsable.updateTitle).toHaveBeenCalled();
    expect(mockCollapsable.replaceContent).toHaveBeenCalledWith(expect.any(Array));
  });

  it('should update content with empty descriptions', () => {
    // Setup mock exercise and metadata
    const mockExercise = {} as Exercise;
    (ExerciseMetadata.getId as Mock).mockReturnValue('TestExercise');
    (ExerciseMetadata.getDescriptions as Mock).mockReturnValue([]);

    // Update content
    infoBox.updateContent(mockExercise);

    // Verify empty content handling
    expect(mockCollapsable.replaceContent).toHaveBeenCalledWith([]);
  });

  it('should close the collapsable', () => {
    infoBox.close();
    expect(mockCollapsable.close).toHaveBeenCalled();
  });
});
