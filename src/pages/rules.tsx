import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
} from '@mui/material';

export default function RulesPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* "py: 4" adds vertical padding. Increase or decrease to taste. */}

      {/* Our Pledge */}
      <Typography variant="h4" gutterBottom>
        Our Pledge
      </Typography>
      <Typography variant="body1" paragraph>
        We as members, contributors, and leaders pledge to make participation
        in our community a harassment-free experience for everyone, regardless
        of age, body size, visible or invisible disability, ethnicity, sex
        characteristics, gender identity and expression, level of experience,
        education, socio-economic status, nationality, personal appearance,
        race, caste, color, religion, or sexual identity and orientation.
      </Typography>
      <Typography variant="body1" paragraph>
        We pledge to act and interact in ways that contribute to an open,
        welcoming, diverse, inclusive, and healthy community.
      </Typography>

      {/* Our Standards */}
      <Typography variant="h4" gutterBottom>
        Our Standards
      </Typography>
      <Typography variant="body1" paragraph>
        Examples of behavior that contributes to a positive environment for
        our community include:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        <ListItem sx={{ display: 'list-item' }}>
          Demonstrating empathy and kindness toward other people
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          Being respectful of differing opinions, viewpoints, and experiences
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          Giving and gracefully accepting constructive feedback
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          Accepting responsibility and apologizing to those affected by our
          mistakes, and learning from the experience
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          Focusing on what is best not just for us as individuals, but for
          the overall community
        </ListItem>
      </List>

      <Typography variant="body1" paragraph>
        Examples of unacceptable behavior include:
      </Typography>
      <List sx={{ listStyleType: 'disc', pl: 4 }}>
        <ListItem sx={{ display: 'list-item' }}>
          The use of sexualized language or imagery, and sexual attention or
          advances of any kind
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          Trolling, insulting or derogatory comments, and personal or political
          attacks
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>Public or private harassment</ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          Publishing others' private information, such as a physical or email
          address, without their explicit permission
        </ListItem>
        <ListItem sx={{ display: 'list-item' }}>
          Other conduct which could reasonably be considered inappropriate in
          a professional setting
        </ListItem>
      </List>

      {/* Enforcement Responsibilities */}
      <Typography variant="h4" gutterBottom>
        Enforcement Responsibilities
      </Typography>
      <Typography variant="body1" paragraph>
        Community leaders are responsible for clarifying and enforcing our
        standards of acceptable behavior and will take appropriate and fair
        corrective action in response to any behavior that they deem
        inappropriate, threatening, offensive, or harmful.
      </Typography>
      <Typography variant="body1" paragraph>
        Community leaders have the right and responsibility to remove, edit,
        or reject comments, commits, code, wiki edits, issues, and other
        contributions that are not aligned to this Code of Conduct, and will
        communicate reasons for moderation decisions when appropriate.
      </Typography>

      {/* Scope */}
      <Typography variant="h4" gutterBottom>
        Scope
      </Typography>
      <Typography variant="body1" paragraph>
        This Code of Conduct applies within all community spaces, and also
        applies when an individual is officially representing the community
        in public spaces. Examples of representing our community include using
        an official email address, posting via an official social media account,
        or acting as an appointed representative at an online or offline event.
      </Typography>

      {/* Enforcement */}
      <Typography variant="h4" gutterBottom>
        Enforcement
      </Typography>
      <Typography variant="body1" paragraph>
        Instances of abusive, harassing, or otherwise unacceptable behavior
        may be reported to the community leaders responsible for enforcement
        at [INSERT CONTACT METHOD]. All complaints will be reviewed and
        investigated promptly and fairly.
      </Typography>
      <Typography variant="body1" paragraph>
        All community leaders are obligated to respect the privacy and security
        of the reporter of any incident.
      </Typography>

      {/* Enforcement Guidelines */}
      <Typography variant="h4" gutterBottom>
        Enforcement Guidelines
      </Typography>
      <Typography variant="body1" paragraph>
        Community leaders will follow these Community Impact Guidelines in
        determining the consequences for any action they deem in violation of
        this Code of Conduct:
      </Typography>

      {/* Impact Levels */}
      <Box sx={{ ml: 2 }}>
        {/* 1. Correction */}
        <Typography variant="h6" gutterBottom>
          1. Correction
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Community Impact: </strong>
          Use of inappropriate language or other behavior deemed
          unprofessional or unwelcome in the community.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Consequence: </strong>
          A private, written warning from community leaders, providing clarity
          around the nature of the violation and an explanation of why the
          behavior was inappropriate. A public apology may be requested.
        </Typography>

        {/* 2. Warning */}
        <Typography variant="h6" gutterBottom>
          2. Warning
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Community Impact: </strong>
          A violation through a single incident or series of actions.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Consequence: </strong>
          A warning with consequences for continued behavior. No interaction
          with the people involved, including unsolicited interaction with those
          enforcing the Code of Conduct, for a specified period of time. This
          includes avoiding interactions in community spaces as well as external
          channels like social media. Violating these terms may lead to a
          temporary or permanent ban.
        </Typography>

        {/* 3. Temporary Ban */}
        <Typography variant="h6" gutterBottom>
          3. Temporary Ban
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Community Impact: </strong>
          A serious violation of community standards, including sustained
          inappropriate behavior.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Consequence: </strong>
          A temporary ban from any sort of interaction or public communication
          with the community for a specified period of time. No public or
          private interaction with the people involved, including unsolicited
          interaction with those enforcing the Code of Conduct, is allowed
          during this period. Violating these terms may lead to a permanent ban.
        </Typography>

        {/* 4. Permanent Ban */}
        <Typography variant="h6" gutterBottom>
          4. Permanent Ban
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Community Impact: </strong>
          Demonstrating a pattern of violation of community standards, including
          sustained inappropriate behavior, harassment of an individual, or
          aggression toward or disparagement of classes of individuals.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Consequence: </strong>
          A permanent ban from any sort of public interaction within the
          community.
        </Typography>
      </Box>

      {/* Attribution */}
      <Typography variant="h4" gutterBottom>
        Attribution
      </Typography>
      <Typography variant="body1" paragraph>
        This Code of Conduct is adapted from the Contributor Covenant, version
        2.1, available at{' '}
        <a
          href="https://www.contributor-covenant.org/version/2/1/code_of_conduct.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.contributor-covenant.org/version/2/1/code_of_conduct.html
        </a>
        .
      </Typography>
      <Typography variant="body1" paragraph>
        Community Impact Guidelines were inspired by Mozilla's code of
        conduct enforcement ladder.
      </Typography>
      <Typography variant="body1">
        For answers to common questions about this code of conduct, see the FAQ
        at{' '}
        <a
          href="https://www.contributor-covenant.org/faq"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.contributor-covenant.org/faq
        </a>
        . Translations are available at{' '}
        <a
          href="https://www.contributor-covenant.org/translations"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.contributor-covenant.org/translations
        </a>
        .
      </Typography>
    </Container>
  );
}
